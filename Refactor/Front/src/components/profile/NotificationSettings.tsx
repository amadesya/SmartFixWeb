import React from 'react';
import { Bell, Send } from 'lucide-react';
import { Button } from '../ui/Button';

interface NotificationSettingsProps {
    onPushSubscribe: () => void;
    isSubscribing: boolean;
    botUrl: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
    onPushSubscribe,
    isSubscribing,
    botUrl
}) => {
    return (
        <div className="py-6 border-y border-smartfix-medium/30 my-6">
            <h4 className="text-xl font-semibold dark:text-smartfix-light text-black mb-4">Уведомления</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                    type="button"
                    onClick={onPushSubscribe}
                    disabled={isSubscribing}
                    className="w-full flex items-center justify-center gap-2 h-[42px] text-sm rounded-lg bg-smartfix-dark hover:bg-smartfix-dark/80 text-white"
                >
                    <Bell size={18} />
                    <span>{isSubscribing ? 'Настройка...' : 'Уведомления в браузере'}</span>
                </Button>

                {/* Кнопка 2: Telegram (теперь точно такая же) */}
                {/* <button
                    type="button"
                    onClick={() => window.open(botUrl, '_blank', 'noopener,noreferrer')}
                    className="w-full flex items-center justify-center gap-2 h-[42px] bg-[#0088cc] hover:bg-[#007bb5] text-white text-sm rounded-lg transition-all active:scale-[0.98] shadow-sm"
                >
                    <Send size={18} />
                    <span>Подключить Telegram</span>
                </button> */}
                </div>
            </div>
    );
};

export default NotificationSettings;