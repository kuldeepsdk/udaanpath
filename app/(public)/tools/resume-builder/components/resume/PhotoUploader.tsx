"use client";

type Props = {
  value: string | null;
  onChange: (val: string | null) => void;
};

export default function PhotoUploader({ value, onChange }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file); // ✅ base64
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">
        Profile Photo
      </label>

      {value && (
        <img
          src={value}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="text-xs"
      />

      {value && (
        <button
          className="text-xs text-red-600 underline"
          onClick={() => onChange(null)}
        >
          Remove photo
        </button>
      )}
    </div>
  );
}
