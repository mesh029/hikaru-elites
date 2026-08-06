import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C1C1C",
          borderRadius: 40,
          border: "5px solid rgba(226, 61, 46, 0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            color: "#E23D2E",
            lineHeight: 1,
            marginTop: -6,
          }}
        >
          ♞
        </div>
      </div>
    ),
    { ...size }
  );
}
