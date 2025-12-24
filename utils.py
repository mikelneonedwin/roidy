import customtkinter


def set_sensible_geometry(
    window: customtkinter.CTk, width_ratio=0.75, height_ratio=0.7
):
    window.update_idletasks()

    screen_w = window.winfo_screenwidth()
    screen_h = window.winfo_screenheight()

    win_w = int(screen_w * width_ratio)
    win_h = int(screen_h * height_ratio)

    x = (screen_w - win_w) // 2
    y = (screen_h - win_h) // 2

    window.geometry(f"{win_w}x{win_h}+{x}+{y}")
    window.minsize(800, 500)
