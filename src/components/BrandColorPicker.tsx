import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface BrandColor {
  name: string;
  hex: string;
}

interface BrandColorPickerProps {
  colors: BrandColor[];
  onChange: (colors: BrandColor[]) => void;
}

export default function BrandColorPicker({
  colors,
  onChange,
}: BrandColorPickerProps) {
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(
    null,
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setActivePickerIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateColor = (
    index: number,
    field: keyof BrandColor,
    value: string,
  ) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    onChange(newColors);
  };

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
    if (activePickerIndex === index) {
      setActivePickerIndex(null);
    }
  };

  const addColor = () => {
    onChange([...colors, { name: "", hex: "#0057FF" }]);
  };

  return (
    <div className="brand-colors-wrapper">
      {colors.map((c, i) => {
        let validHex = c.hex;
        if (!validHex.startsWith("#")) validHex = "#" + validHex;

        return (
          <div
            key={i}
            className="brand-color-row"
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: validHex.length >= 4 ? validHex : "#000000",
                borderRadius: "8px",
                border: "1px solid #475E8C",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.15s ease-in-out",
              }}
              onClick={() =>
                setActivePickerIndex(activePickerIndex === i ? null : i)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActivePickerIndex(activePickerIndex === i ? null : i);
                }
              }}
              aria-label="Select color"
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />

            {activePickerIndex === i && (
              <>
                <div
                  className="color-picker-backdrop"
                  onClick={() => setActivePickerIndex(null)}
                />
                <div
                  ref={pickerRef}
                  className="color-picker-popup"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    zIndex: 50,
                    padding: "16px",
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <HexColorPicker
                    color={validHex.length >= 4 ? validHex : "#000000"}
                    onChange={(newHex) =>
                      updateColor(i, "hex", newHex.toUpperCase())
                    }
                    style={{ width: "100%", height: "240px" }}
                  />
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      background: "var(--body-bg)",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor:
                          validHex.length >= 4 ? validHex : "#000000",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--primary)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {c.hex.toUpperCase()}
                    </span>
                  </div>
                </div>
              </>
            )}
            <input
              type="text"
              placeholder="HEX (e.g. #0057FF)"
              value={c.hex}
              onChange={(e) => {
                let val = e.target.value;
                if (
                  !val.startsWith("#") &&
                  val.length > 0 &&
                  /^[0-9A-Fa-f]/.test(val)
                ) {
                  val = "#" + val;
                }
                updateColor(i, "hex", val.toUpperCase());
              }}
              style={{ flex: 1, minWidth: "120px" }}
              aria-label="Color HEX"
            />

            <input
              type="text"
              placeholder="Name (e.g. Blue)"
              value={c.name}
              onChange={(e) => updateColor(i, "name", e.target.value)}
              style={{ flex: 1, minWidth: "120px" }}
              aria-label="Color Name"
            />

            {colors.length > 1 && (
              <button
                type="button"
                onClick={() => removeColor(i)}
                className="btn-outline btn-small"
                style={{
                  padding: "0 12px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Remove color"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={addColor}
        className="btn btn-outline btn-small"
        style={{ marginTop: "8px" }}
      >
        + Add Color
      </button>
      <input type="hidden" name="brand_colors" value={JSON.stringify(colors)} />
    </div>
  );
}
