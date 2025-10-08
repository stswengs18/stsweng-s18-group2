function getColorFromId(id) {
  let hash = 0;
  const strId = id.toString();
  for (let i = 0; i < strId.length; i++) {
    hash = strId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = (hash % 360 + 360) % 360; // ensure positive hue
  return `hsl(${hue}, 70%, 50%)`;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function getTextColorForBackground(hsl) {
  const match = hsl.match(/hsl\((.+), (.+)%, (.+)%\)/);
  if (!match) {
    console.error("Invalid HSL string:", hsl);
    return "white"; // fallback
  }
  const [, h, s, l] = match.map(Number);
  const [r, g, b] = hslToRgb(h, s, l);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "black" : "white";
}

// wip
export default function ClientEntry({
  id,
  sm_number,
  spu,
  name,
  assigned_sdw_name,
  archive,
  pendingTermination = false,
  showCheckbox = false,
  onSelectChange,
  isSelected = false,
}) {
  const initials = name.charAt(0).toUpperCase();

  let bgColor = getColorFromId(name);
  let textColor = getTextColorForBackground(bgColor);

  if (archive) {
    bgColor = "#6b6c6e";
    textColor = "#ffffff";
  }

  // const handleRowClick = () => {
  //   window.location.href = `/case/${id}`;
  // };

  return (
<a
  href={`/case/${id}`}
  className={`relative client-entry grid grid-cols-[2fr_1fr_2fr] items-center p-5 mb-2 rounded-lg font-bold-label
    ${pendingTermination ? "bg-white border border-red-500" : "bg-white border border-transparent"}
    ${showCheckbox ? "pl-12" : "pl-5"}
    `}
>

      {/* checkbox column */}
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onSelectChange?.(id, e.target.checked)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-[16px] h-[15px] border border-black rounded-[3px] bg-white cursor-pointer"
        />
      )}

      <div className="flex items-center gap-6">
        <div
          className="rounded-full h-[4.5rem] min-w-[4.5rem] flex justify-center items-center header-sub"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {initials}
        </div>
        <p>{name}</p>
      </div>
      <p className="text-center">{sm_number}</p>
      <p className="text-center">{assigned_sdw_name}</p>

      {pendingTermination && (
        <div className="col-span-3 text-left mt-4">
          <p className="font-label !text-xl !text-red-600">
            Termination Request Found
          </p>
        </div>
      )}
    </a>
  );
}
