import { useState } from "react";
import { IoCopy, IoCheckmark } from "react-icons/io5";


interface CopyButtonProps {
  value: string;
  label?: string; // optional tooltip text
}

export default function CopyButton({ value, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="relative p-1 rounded-md transition-all duration-200 
                 hover:bg-gray-200 active:scale-95 cursor-pointer"
      title={label}
    >
      <span
        className={`transition-all duration-200 ${
          copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <IoCopy className="text-gray-500 hover:text-gray-800" size={16} />
      </span>

      <span
        className={`absolute inset-0 flex items-center justify-center
                    transition-all duration-200 ${
                      copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    }`}
      >
        <IoCheckmark className="text-green-600" size={18} />
      </span>
    </button>
  );
}