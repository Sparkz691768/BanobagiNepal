import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default function ChatMessage({ message, currentUserId }) {
  const isOwn = message.sender_id === currentUserId
  const isSystem = message.sender_role === 'system'

  if (isSystem) {
    return (
      <div className="text-center my-3">
        <span className="text-xs bg-green-50 text-green-700 px-4 py-2 border border-green-100 inline-block">
          {message.message}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col mb-3 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-muted uppercase tracking-widest">
          {isOwn ? 'You' : message.sender_name || message.sender_role}
        </span>
        <span className="text-[10px] text-muted">{formatDate(message.created_at)}</span>
      </div>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 text-sm ${
          isOwn
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-body'
        }`}
      >
        {message.message && <p>{message.message}</p>}
        {message.attachment_url && (
          <div className="mt-2 relative">
            <Image
              src={message.attachment_url}
              alt="attachment"
              width={200}
              height={200}
              className="object-contain cursor-pointer"
              onClick={() => window.open(message.attachment_url, '_blank')}
            />
          </div>
        )}
      </div>
    </div>
  )
}
