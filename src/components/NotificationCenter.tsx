import React from 'react';
import { AppNotification } from '../types';
import { Bell, Package, Truck, CheckCheck, MessageSquare, ShoppingBag, ArrowRight } from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
  currentRole: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onNotificationClick,
  currentRole,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order_received':
        return <ShoppingBag className="w-4 h-4 text-[#8B5E34]" />;
      case 'order_placed':
        return <Package className="w-4 h-4 text-[#8B5E34]" />;
      case 'order_dispatched':
        return <Truck className="w-4 h-4 text-[#8B5E34]" />;
      case 'order_delivered':
        return <CheckCheck className="w-4 h-4 text-[#8B5E34]" />;
      default:
        return <Bell className="w-4 h-4 text-[#8B5E34]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-[#3E2723]/40 backdrop-blur-2xs">
      <div className="w-full max-w-md bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl overflow-hidden mt-14 sm:mt-16 animate-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#FAF9F7] border-b border-[#E6D5C3]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#8B5E34]" />
            <h3 className="font-bold font-serif text-[#3E2723] text-sm">Notifications & Order Alerts</h3>
            <span className="text-[10px] font-bold bg-[#8B5E34] text-white px-2 py-0.5 rounded-full">
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] font-semibold text-[#8B5E34] hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#8C7355] hover:text-[#3E2723] p-1 rounded-md"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-[#E6D5C3] p-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8C7355]">
              <Bell className="w-8 h-8 mx-auto text-[#E6D5C3] mb-2" />
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNotificationClick(notif)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-colors flex items-start gap-3 ${
                  notif.read ? 'hover:bg-[#FAF9F7]' : 'bg-[#F5F1EE] hover:bg-[#FAF9F7]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E6D5C3] flex items-center justify-center shrink-0 shadow-2xs">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-[#3E2723] truncate">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#8B5E34] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#6D5843] leading-snug mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#8C7355] mt-1.5 font-mono">
                    <span>
                      {new Date(notif.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-[#8B5E34] font-semibold flex items-center gap-0.5">
                      View Details <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
