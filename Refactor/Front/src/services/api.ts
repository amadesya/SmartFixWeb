import {
  RepairRequest,
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  ServiceDto,
  Role,
  Review,
  CreateReviewDto,
  MasterStatsDto
} from "../types";

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL || "/api";
  // Удаляет слеш на конце, если он есть (превращает "/api/" в "/api")
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const API_URL = getApiBaseUrl(); // Теперь слешей-дубликатов точно не будет

/** URL хаба уведомлений — тот же хост, что и API (см. VITE_API_URL). */
export function getNotificationHubUrl(): string {
  const fromEnv = import.meta.env.VITE_SIGNALR_HUB_URL;
  if (fromEnv) return fromEnv;
  const base = getApiBaseUrl();
  return base ? `${base}/notificationHub` : "/notificationHub";
}

export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: "Bearer " + token } : {};
}


// ======================= Auth =======================

// Регистрация
export const login = async (
  email: string,
  password: string,
): Promise<AuthResponseDto | null> => {
  try {
    const res = await fetch(`${API_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to login:", res.status, text);
      return null;
    }

    const data: AuthResponseDto = await res.json();

    // Сохраняем в localStorage
    localStorage.setItem("smartfix_user", JSON.stringify(data));
    localStorage.setItem("token", data.token);

    return data;
  } catch (err) {
    console.error("Error login:", err);
    return null;
  }
};

export const register = async (
  name: string, email: string, password: string
): Promise<AuthResponseDto | null> => {
  try {
    const res = await fetch(`${API_URL}/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      // Здесь можно выкинуть ошибку, чтобы она попала в catch компонента
      const errorText = await res.text();
      console.error("Failed to register:", res.status, errorText);
      return null;
    }

    const json = await res.json();
    return json; // Возвращаем результат парсинга, а не null!
  } catch (err) {
    console.error("Error register:", err);
    return null;
  }
};
// ======================= Users =======================

// Все пользователи
export async function getUsers() {
  const res = await fetch(`${API_URL}/Users`, {
    headers: { ...(getAuthHeader() as Record<string, string>) },
  });
  if (!res.ok) throw new Error("Не удалось получить пользователей");
  return res.json();
}

// Только техники
export async function getTechnicians() {
  const res = await fetch(`${API_URL}/Users/technicians`, {
    headers: { ...(getAuthHeader() as Record<string, string>) },
  });
  if (!res.ok) throw new Error("Не удалось получить мастеров");
  return res.json();
}

// ======================= RepairRequests =======================

// Получить все заявки
export async function getRepairRequests(): Promise<RepairRequest[]> {
  const res = await fetch(`${API_URL}/RepairRequests`, {
    headers: { ...(getAuthHeader() as Record<string, string>) },
  });

  if (!res.ok) throw new Error("Не удалось получить заявки");

  const data = await res.json();

  return data.map((r: any) => ({
    id: r.id,
    clientName: r.clientName,
    clientId: r.clientId,
    device: r.device,
    issueDescription: r.issueDescription,
    status: r.status,
    technicianId: r.technicianId,
    technicianName: r.technicianName || "Не назначен",
    comments: r.comments || [],
    createdAt: r.createdAt,
    price: r.price,
    clientDiscount: r.clientDiscount || 0,
  }));
}

export const importRepairRequests = async (
  data: any[],
): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
}> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/RepairRequests/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Ошибка импорта");
  }

  return response.json();
};

// Создать заявку
export async function createRepairRequest(
  clientId: number,
  technicianId: number | null,
  device: string,
  issueDescription: string,
) {
  const res = await fetch(`${API_URL}/RepairRequests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // или user.token
    },
    body: JSON.stringify({ clientId, technicianId, device, issueDescription }),
  });

  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

// Обновить заявку
export async function updateRepairRequest(
  id: number,
  technicianId: number | null,
  device: string,
  issueDescription: string,
  status: string,
) {
  const res = await fetch(`${API_URL}/RepairRequests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeader() as Record<string, string>),
    },
    body: JSON.stringify({ technicianId, device, issueDescription, status }),
  });
  if (!res.ok) throw new Error("Не удалось обновить заявку");
  return res.json(); // backend now returns { request, partsReturned }
}

// Обновить цену на заявку
export async function updateRepairRequestPrice(id: number, price: number) {
  const res = await fetch(`${API_URL}/RepairRequests/${id}/price`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeader() as Record<string, string>),
    },
    body: JSON.stringify({ price }),
  });
  if (!res.ok) throw new Error("Не удалось обновить цену заявки");
  return res.json();
}

const REPAIR_REQUESTS_URL = `${API_URL}/RepairRequests`;

export async function deleteRepairRequest(
  id: number,
): Promise<any> {
  const res = await fetch(`${REPAIR_REQUESTS_URL}/${id}`, {
    method: "DELETE",
    headers: { ...(getAuthHeader() as Record<string, string>) },
  });

  if (res.status === 204) {
    return true;
  }

  if (!res.ok) {
    const errorText = await res.text();
    const error = new Error(errorText || `Ошибка ${res.status}`);
    (error as any).status = res.status;
    throw error;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : true;
}

// ======================= Comments =======================

// Получить комментарии по заявке
// Для отправки на сервер
export interface CreateCommentDto {
  repairRequestId: number;
  userId: number;
  text: string;
}

// Для получения с сервера
export interface CommentDto {
  id: number;
  repairRequestId: number;
  userId: number;
  text: string;
  date: string;
  userName: string;
}

export async function createComment(
  commentDto: CreateCommentDto,
): Promise<CommentDto> {
  console.log("Creating comment with data:", commentDto);
  console.log("Full URL:", `${API_URL}/comments`); //
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeader() as Record<string, string>),
    },
    body: JSON.stringify(commentDto),
  });

  console.log("Response status:", res.status);
  console.log("Response headers:", res.headers);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create comment error response:", errorText);
    throw new Error(
      `Не удалось создать комментарий: ${res.status} ${errorText}`,
    );
  }

  const responseData = await res.json();
  console.log("Created comment response:", responseData);
  return responseData;
}

export async function getComments(requestId: number): Promise<CommentDto[]> {
  const res = await fetch(`${API_URL}/comments/${requestId}`, {
    headers: { ...(getAuthHeader() as Record<string, string>) },
  });

  if (!res.ok) {
    console.error("Failed to fetch comments:", res.status, res.statusText);
    throw new Error("Не удалось получить комментарии");
  }

  return res.json();
}

export async function updateComment(
  id: number,
  comment: CommentDto,
): Promise<CommentDto | null> {
  const res = await fetch(`${API_URL}/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeader() as Record<string, string>),
    },
    body: JSON.stringify(comment),
  });

  if (!res.ok) {
    const errorText = await res.text(); // Читаем как текст, чтобы избежать падения
    throw new Error(errorText || "Не удалось обновить комментарий");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function deleteComment(id: number, userId: number, userRole: number) {
  const url = `${API_URL}/comments/${id}?userId=${userId}&userRole=${userRole}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      ...(getAuthHeader() as Record<string, string>),
    },
  });

  // Если статус 200 (OK), 204 (No Content) или даже 404 (если уже удалено)
  // Мы считаем, что цель достигнута
  if (res.ok || res.status === 404) {
    return true;
  }

  // Если же ошибка действительно серьезная (500, 403, 400)
  const errorText = await res.text();
  throw new Error(errorText || "Ошибка при удалении");
}

// ======================= Services =======================

export const servicesApi = {
  // Получить все услуги
  getAll: async () => {
    const res = await fetch(`${API_URL}/Services`, {
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось получить услуги");
    return res.json();
  },

  // Получить услугу по ID
  getById: async (id: number) => {
    const res = await fetch(`${API_URL}/Services/${id}`, {
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось получить услугу");
    return res.json();
  },

  // Создать услугу
  create: async (service: any) => {
    const isFormData = service instanceof FormData;
    const res = await fetch(`${API_URL}/Services`, {
      method: "POST",
      headers: {
        ...(getAuthHeader() as Record<string, string>),
        ...(isFormData ? {} : { "Content-Type": "application/json" })
      },
      body: isFormData ? service : JSON.stringify(service),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Не удалось создать услугу");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  // Обновить услугу
  update: async (
    id: number,
    service: any
  ) => {
    const isFormData = service instanceof FormData;
    const res = await fetch(`${API_URL}/Services/${id}`, {
      method: "PUT",
      headers: {
        ...(getAuthHeader() as Record<string, string>),
        ...(isFormData ? {} : { "Content-Type": "application/json" })
      },
      body: isFormData ? service : JSON.stringify(service),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Не удалось обновить услугу");
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  // Удалить услугу
  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/Services/${id}`, {
      method: "DELETE",
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Не удалось удалить услугу");
    }
    return res.json();
  }
};

export async function getTechnicianRequests(
  technicianId: number,
  status?: string,
  startDate?: string,
  endDate?: string,
) {
  const params = new URLSearchParams();

  if (status && status !== "all") params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await fetch(
    `${API_URL}/RepairRequests/technician/${technicianId}?${params.toString()}`,
  );

  if (!response.ok) throw new Error("Failed to load technician requests");
  return response.json();
}

// Добавьте эти функции к существующим в api.ts

// ======================= Users Management =======================

export async function createUser(data: any) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_URL}/Users`, {
    method: "POST",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(getAuthHeader() as Record<string, string>),
    },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Не удалось создать пользователя");
  }

  return res.json();
}

export async function updateUser(id: number, data: any) {
  let bodyToSend: FormData;

  // 1. Если нам передали уже готовый FormData (как из ProfilePage)
  if (data instanceof FormData) {
    bodyToSend = data;
  }
  // 2. Если нам передали обычный объект (как из UsersPage)
  else {
    bodyToSend = new FormData();
    for (const key in data) {
      // Игнорируем пустые/null значения
      if (data[key] !== undefined && data[key] !== null) {
        // Если там лежит файл, добавляем как файл, остальное как текст
        bodyToSend.append(key, data[key]);
      }
    }
  }

  const res = await fetch(`${API_URL}/Users/${id}`, {
    method: "PUT",
    headers: {
      // ВАЖНО: Мы НЕ указываем "Content-Type".
      // При отправке FormData браузер обязан сам установить Content-Type: multipart/form-data
      // и сгенерировать уникальный boundary (разделитель).
      ...(getAuthHeader() as Record<string, string>),
    },
    body: bodyToSend,
  });

  if (!res.ok) {
    // На случай, если сервер вернул ошибку не в формате JSON
    let errorMessage = "Ошибка обновления";
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      console.error("Ошибка парсинга ответа с ошибкой", e);
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
export async function deleteUser(id: number) {
  const res = await fetch(`${API_URL}/Users/${id}`, {
    method: "DELETE",
    headers: {
      ...(getAuthHeader() as Record<string, string>),
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Не удалось удалить пользователя");
  }

  return res.json();
}

export async function getUserById(id: number) {
  const res = await fetch(`${API_URL}/Users/${id}`, {
    headers: { ...(getAuthHeader() as Record<string, string>) },
  });

  if (!res.ok) {
    throw new Error("Не удалось получить пользователя");
  }

  return res.json();
}

// ========================== Inventory (Склад) ==========================

// Получить все запчасти
export const getInventory = async (): Promise<any[]> => {
  const res = await fetch(`${API_URL}/SpareParts`, {
    headers: getAuthHeader() as HeadersInit,
  });
  if (!res.ok) return [];
  return await res.json();
};

// Получить историю склада с пагинацией и фильтрами
export const getStockMovements = async (page: number = 1, pageSize: number = 20, type?: string, search?: string) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (type) params.append("type", type);
  if (search) params.append("search", search);

  const res = await fetch(`${API_URL}/StockMovement?${params.toString()}`, {
    headers: getAuthHeader() as HeadersInit,
  });
  if (!res.ok) throw new Error("Ошибка при загрузке истории операций");
  return res.json();
};

// Добавить новую запчасть
export const createPart = async (partData: any) => {
  const res = await fetch(`${API_URL}/SpareParts/purchase`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify(partData),
  });
  return res.ok;
};

// Удалить запчасть
export const deletePart = async (id: number) => {
  const res = await fetch(`${API_URL}/SpareParts/${id}`, {
    method: "DELETE",
    headers: getAuthHeader() as HeadersInit,
  });
  return res.ok;
};

// Обновить существующую запчасть
export const updatePart = async (id: number, partData: any) => {
  const res = await fetch(`${API_URL}/SpareParts/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify(partData),
  });
  return res.ok;
};

export const createTypePart = async (partData: any) => {
  const res = await fetch(`${API_URL}/SparePartTypes`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify(partData),
  });
  return res.ok;
};

export const deleteTypePart = async (id: number) => {
  const res = await fetch(`${API_URL}/SparePartTypes/${id}`, {
    method: "DELETE",
    headers: getAuthHeader() as HeadersInit,
  });
  return res.ok;
};

export const updateTypePart = async (id: number, partData: any) => {
  const res = await fetch(`${API_URL}/SparePartTypes/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify(partData),
  });
  return res.ok;
};

export const getTypePart = async () => {
  const res = await fetch(`${API_URL}/SparePartTypes`, {
    headers: getAuthHeader() as HeadersInit,
  });
  if (!res.ok) {
    throw new Error("Не удалось получить тип запчасти");
  }
  return res.json();
};

export const getRequestPrice = async (id: number) => {
  const res = await fetch(`${API_URL}/RepairRequests/${id}/price`, {
    headers: getAuthHeader() as HeadersInit,
  });

  if (!res.ok) {
    throw new Error("Не удалось получить цену заявки");
  }

  return res.json();
};

export const createPayment = async (requestId: number, bonusesToSubtract: number = 0) => {
  const res = await fetch(`${API_URL}/Pay/requests/${requestId}/pay`, {
    method: "POST",
    headers: {
      ...(getAuthHeader() as Record<string, string>),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bonusesToSubtract }),
  });

  if (!res.ok) {
    throw new Error("Ошибка при создании платежа");
  }

  return res.json();
};

export interface EmployeeDto {
  id: number;
  userId: number;
  userName: string;
  userRole: number;
  avatar: string;
  baseSalary: number;
  bonusPercentage: number;
}

export interface CreateEmployeeDto {
  userId: number;
  baseSalary: number;
  bonusPercentage: number;
}

export const employeesApi = {
  // Получить всех сотрудников
  getAll: async (): Promise<EmployeeDto[]> => {
    const response = await fetch(`${API_URL}/employees`);
    if (!response.ok) throw new Error("Ошибка при загрузке данных с сервера");
    return response.json();
  },

  // Создать сотрудника
  create: async (data: CreateEmployeeDto): Promise<EmployeeDto> => {
    const response = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Ошибка при добавлении сотрудника");
    }
    return response.json();
  },

  // Удалить сотрудника
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Ошибка при удалении");
  },

  update: async (
    id: number,
    data: { baseSalary: number; bonusPercentage: number },
  ): Promise<EmployeeDto> => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Ошибка при обновлении сотрудника");
    return response.json();
  },
};

// В начало файла добавь интерфейс пользователя
export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: number;
  totalSpent?: number;
  personalDiscount?: number;
  bonusPoints?: number;
  clientNotes?: string;
}

// Ниже, рядом с employeesApi, добавь:
export const usersApi = {
  getAll: async (): Promise<UserDto[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error("Ошибка при загрузке пользователей");
    return response.json();
  },
};

export interface Promotion {
    id: number;
    title: string;
    description: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export const promotionsApi = {
    getAll: async (): Promise<Promotion[]> => {
        const response = await fetch(`${API_URL}/Promotions`);
        if (!response.ok) throw new Error("Ошибка загрузки акций");
        return response.json();
    }
};

export const reviewService = {
  // Получить все отзывы
  async getAll(): Promise<Review[]> {
    const response = await fetch(`${API_URL}/Reviews`, {
      headers: { ...(getAuthHeader() as Record<string, string>) }
    });
    if (!response.ok) throw new Error('Ошибка при получении отзывов');
    return await response.json();
  },

  // Получить один отзыв
  async getById(id: number): Promise<Review> {
    const response = await fetch(`${API_URL}/Reviews/${id}`, {
      headers: { ...(getAuthHeader() as Record<string, string>) }
    });
    if (!response.ok) throw new Error('Отзыв не найден');
    return await response.json();
  },

  // Создать новый отзыв
  async create(dto: CreateReviewDto): Promise<Review> {
    const response = await fetch(`${API_URL}/Reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error('Ошибка при создании отзыва');
    return await response.json();
  },

  // Обновить отзыв
  async update(id: number, reviewData: Partial<Review>): Promise<void> {
    const response = await fetch(`${API_URL}/Reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify({ id, ...reviewData }),
    });
    if (!response.ok) throw new Error('Ошибка при обновлении отзыва');
  },

  // Удалить отзыв
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/Reviews/${id}`, {
      method: 'DELETE',
      headers: {
        ...(getAuthHeader() as Record<string, string>)
      }
    });
    if (!response.ok) throw new Error('Ошибка при удалении отзыва');
  }


};

export interface ClientDetailsDto {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  registeredAt: string;
  loyalty: {
    tier: string;
    discountPercent: number;
    bonusPoints: number;
    totalSpent: number;
  };
  history: {
    id: number;
    date: string;
    device: string;
    problem: string;
    status: string;
    cost: number;
  }[];
}

export const clientsApi = {
  getProfile: async (id: number): Promise<ClientDetailsDto> => {
    const res = await fetch(`${API_URL}/clients/${id}/profile`, {
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось получить профиль клиента");
    return res.json();
  }
};

export const repairRequestsApi = {
  getById: async (id: number) => {
    const res = await fetch(`${API_URL}/repairrequests/${id}`, {
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось получить детали заявки");
    return res.json();
  },

  updateStatus: async (id: number, status: string) => {
    const response = await fetch(`${API_URL}/repairrequests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Ошибка при обновлении статуса");
    return response.json();
  },

  addServiceToRequest: async (requestId: number, serviceId: number, price: number) => {
    const response = await fetch(`${API_URL}/repairrequests/${requestId}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify({ id: serviceId, price })
    });
    if (!response.ok) throw new Error("Ошибка при добавлении услуги");
    return response.json();
  },

  addPartToRequest: async (requestId: number, partId: number, price: number) => {
    const response = await fetch(`${API_URL}/repairrequests/${requestId}/parts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify({ id: partId, price })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Ошибка при добавлении запчасти");
    }
    return response.json();
  },

  completeRepair: async (id: number, services: any[], parts: any[], bonusesSubtracted: number = 0) => {
    const response = await fetch(`${API_URL}/repairrequests/${id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify({ 
        services: services, 
        parts: parts,
        bonusesSubtracted: bonusesSubtracted 
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Ошибка при завершении ремонта. Недостаточно бонусов или сбой сервера.");
    }

    return; 
  },

  applyBonusesToRequest: async (requestId: number, bonusesToSubtract: number) => {
    const response = await fetch(`${API_URL}/repairrequests/${requestId}/apply-bonuses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify({ bonusesToSubtract })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Недостаточно бонусов");
    }
    return response.json();
  },

  getMasterStats: async () => {
    const response = await fetch(`${API_URL}/repairrequests/master-stats`);
    if (!response.ok) throw new Error("Ошибка при получении статистики");
    return response.json();
  },

  removeServiceFromRequest: async (requestId: number, repairServiceId: number) => {
    const response = await fetch(`${API_URL}/repairrequests/${requestId}/services/${repairServiceId}`, {
      method: 'DELETE',
      headers: { ...(getAuthHeader() as Record<string, string>) }
    });
    if (!response.ok) throw new Error("Ошибка при удалении услуги");
  },

  removePartFromRequest: async (requestId: number, repairPartId: number) => {
    const response = await fetch(`${API_URL}/repairrequests/${requestId}/parts/${repairPartId}`, {
      method: 'DELETE',
      headers: { ...(getAuthHeader() as Record<string, string>) }
    });
    if (!response.ok) throw new Error("Ошибка при удалении запчасти");
  },

  updateServicePriceInRequest: async (requestId: number, repairServiceId: number, price: number) => {
    const response = await fetch(`${API_URL}/repairrequests/${requestId}/services/${repairServiceId}/price`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify({ price })
    });
    if (!response.ok) throw new Error("Ошибка при обновлении цены услуги");
  },

  updatePartPriceInRequest: async (requestId: number, repairPartId: number, price: number) => {
    const response = await fetch(`${API_URL}/repairrequests/${requestId}/parts/${repairPartId}/price`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthHeader() as Record<string, string>)
      },
      body: JSON.stringify({ price })
    });
    if (!response.ok) throw new Error("Ошибка при обновлении цены запчасти");
  }
};

export interface AnalyticsSummary {
    newRequests: number;
    completedRequests: number;
    totalRevenue: number;
    totalPartsCost: number;
    totalSalary: number;
    actualProfit: number;
    averageCheck: number;
}

export interface DailyStat {
    date: string;
    revenue: number;
    count: number;
}

export interface TopPerson {
    id: number;
    name: string;
    revenue: number;
    requestsCount: number;
}

async function apiFetch<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${response.statusText}${body ? ` — ${body.slice(0, 200)}` : ""}`);
    }
    return response.json();
}

export interface EmployeeKpi {
    employeeId: number;
    name: string;
    baseSalary: number;
    bonusPercentage: number;
    bonusAmount: number;
    totalPayout: number;
    completedRequests: number;
    personalRevenue: number;
    timeBasedSalary: number;
    hourlyRate: number;
    hoursWorked: number;
}

export const analyticsApi = {
    getSummary: async (from?: string, to?: string): Promise<AnalyticsSummary> => {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        return apiFetch(`${API_URL}/analytics/summary?${params}`);
    },
    getChartData: async (from?: string, to?: string, groupBy?: string): Promise<DailyStat[]> => {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (groupBy) params.set('groupBy', groupBy);
        return apiFetch(`${API_URL}/analytics/charts?${params}`);
    },

    getTopTechnicians: async (from?: string, to?: string): Promise<TopPerson[]> => {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        return apiFetch(`${API_URL}/analytics/top-technicians?${params}`);
    },
    
    getTopClients: async (from?: string, to?: string): Promise<TopPerson[]> => {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        return apiFetch(`${API_URL}/analytics/top-clients?${params}`);
    },

    getKpiSalaries: async (from?: string, to?: string): Promise<EmployeeKpi[]> => {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        return apiFetch(`${API_URL}/analytics/kpi-salaries?${params}`);
    }
};

// Добавь тип запчасти
export interface SparePart {
    id: number;
    name: string;
    stockQuantity: number;
    purchasePrice: number;
    price?: number;
}

// Добавь методы к API
export const sparePartsApi = {
    getAll: async (): Promise<SparePart[]> => {
        const response = await fetch(`${API_URL}/spareparts`);
        if (!response.ok) throw new Error("Ошибка при загрузке данных с сервера");
        return response.json();
    }
};

export interface NotificationDto {
  id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
  userId?: number;
}


export const notificationsApi = {
  getVapidPublicKey: async (): Promise<string> => {
    const res = await fetch(`${API_URL}/Notifications/vapid-public-key`, {
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось получить VAPID ключ");
    return res.text();
  },

  subscribe: async (subscription: any, userId: number) => {
    const res = await fetch(`${API_URL}/Notifications/subscribe?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(getAuthHeader() as Record<string, string>),
      },
      body: JSON.stringify(subscription),
    });
    if (!res.ok) throw new Error("Не удалось сохранить подписку на сервере");
    return res.json();
  },

  // === Управление уведомлениями в БД ===
  getAll: async (): Promise<NotificationDto[]> => {
    const res = await fetch(`${API_URL}/Notifications`, {
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось загрузить уведомления");
    return res.json();
  },

  markAsRead: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/Notifications/${id}/read`, {
      method: "PUT",
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось отметить уведомление как прочитанное");
  },

  markAllAsRead: async (): Promise<void> => {
    const res = await fetch(`${API_URL}/Notifications/read-all`, {
      method: "PUT",
      headers: { ...(getAuthHeader() as Record<string, string>) },
    });
    if (!res.ok) throw new Error("Не удалось очистить список уведомлений");
  }
};