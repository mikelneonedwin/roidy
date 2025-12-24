import customtkinter as ctk

import utils


class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Roidy")

        utils.set_sensible_geometry(self)

        # ===== Single Inline Frame =====
        inline_frame = ctk.CTkFrame(self, fg_color="transparent")
        inline_frame.pack(fill="x", padx=8, pady=8)

        # ---- Left Info ----
        free_label = ctk.CTkLabel(inline_frame, text="💾 1.35 GB / 24.62 GB")
        free_label.pack(side="left", padx=(0, 10))

        battery_label = ctk.CTkLabel(inline_frame, text="🔋 77%")
        battery_label.pack(side="left", padx=(0, 10))

        # ---- Spacer ----
        spacer = ctk.CTkLabel(inline_frame, text="")
        spacer.pack(side="left", expand=True)

        # ---- Right Info ----
        device_label = ctk.CTkLabel(inline_frame, text="📱 itel A631W [WLAN]")
        device_label.pack(side="left", padx=(0, 10))

        ip_label = ctk.CTkLabel(inline_frame, text="🌐 192.168.0.151")
        ip_label.pack(side="left")


if __name__ == "__main__":
    app = App()
    app.mainloop()
