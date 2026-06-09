import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth"; // Используем наш новый хук
import { updateUser } from "../services/api";
import { subscribeUserToPush } from "../utils/pushNotifications";
import { User } from "@/types";

export const useProfileEditor = () => {
  // Получаем данные и функцию обновления из нашего нового AuthContext
  const { user, setUser, isLoading } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const botUsername = "SmartFix_Notify_bot";

  // Состояние формы инициализируем данными из user
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Пожалуйста, выберите изображение" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Размер файла не должен превышать 5MB" });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, avatar: "" }));
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData(prev => ({ ...prev, avatar: '' }));
  };

  const handleAvatarUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, avatar: value }));
    if (value.trim()) {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handlePushSubscribe = async () => {
    if (!user) return;
    setIsSubscribing(true);
    try {
      await subscribeUserToPush(user.id);
      alert("Отлично! Вы успешно подписались на уведомления.");
    } catch (error) {
      alert("Не удалось оформить подписку. Проверьте настройки браузера.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage({ type: "error", text: "Ошибка: пользователь не авторизован" });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Пароли не совпадают" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Name", formData.name);
      formDataToSend.append("Email", formData.email);
      formDataToSend.append("Phone", formData.phone || "");

      if (avatarFile) {
        formDataToSend.append("AvatarFile", avatarFile);
      } else if (formData.avatar && formData.avatar.startsWith("http")) {
        if (formData.avatar !== user.avatar) {
          formDataToSend.append("AvatarUrl", formData.avatar);
        }
      }

      if (formData.password) {
        formDataToSend.append("Password", formData.password);
      }

      const updatedData = await updateUser(user.id, formDataToSend);

      // 1. Создаем объект обновленного пользователя
      const updatedUser: User = {
        ...user,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        avatar: updatedData.avatar,
      };

      // 2. Обновляем контекст (через наш новый setUser)
      setUser(updatedUser);

      // 3. ОБЯЗАТЕЛЬНО обновляем localStorage, чтобы данные сохранились после F5
      localStorage.setItem("smartfix_user", JSON.stringify(updatedUser));

      setMessage({ type: "success", text: "Профиль успешно обновлен" });
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setAvatarPreview(null);
      setAvatarFile(null);

      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Ошибка при обновлении профиля",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    formData,
    botUsername,
    isSaving,
    isSubscribing,
    message,
    avatarPreview,
    fileInputRef,
    isLoading, 
    handleInputChange,
    handleDeleteAvatar,
    handleAvatarFileChange,
    handleAvatarUrlChange,
    handleAvatarButtonClick: () => fileInputRef.current?.click(),
    handlePushSubscribe,
    handleSubmit,
  };
};