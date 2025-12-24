import customtkinter as ctk

import utils
from frames.device_status import DeviceStatusFrame


class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Roidy")

        utils.set_sensible_geometry(self)
        DeviceStatusFrame(self)


app = App()
app.mainloop()
