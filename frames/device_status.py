import subprocess
import threading

import customtkinter as ctk


def get_wlan_ip():
    """
    Returns the IP address of the first connected device if it's connected via WLAN.
    Returns None if not connected via WLAN or no device is connected.
    """
    try:
        # Get list of devices
        devices_output = (
            subprocess.check_output(["adb", "devices"], text=True)
            .strip()
            .splitlines()[1:]
        )
        if not devices_output:
            return None  # no device connected

        serial = devices_output[0].split()[0]

        # Check if WLAN
        if ":" in serial:
            # Extract IP from serial (format: IP:port)
            ip = serial.split(":")[0]
            return ip
        else:
            return None  # Not a WLAN device
    except subprocess.CalledProcessError:
        return None


def is_wlan_connected():
    try:
        devices_output = (
            subprocess.check_output(["adb", "devices"], text=True)
            .strip()
            .splitlines()[1:]
        )
        if not devices_output:
            return False  # No device connected

        # Assume first device in the list
        serial = devices_output[0].split()[0]
        return ":" in serial  # If ':' present, it's a WLAN connection
    except subprocess.CalledProcessError:
        return False


class DeviceStatusFrame(ctk.CTkFrame):
    def __init__(self, master: ctk.CTk):
        super().__init__(master, fg_color="transparent")
        self.pack(fill="x", padx=10, pady=8)

        # ---- Storage ----
        self.storage_label = ctk.CTkLabel(self)
        self.update_storage_info()
        self.storage_label.pack(side="left", padx=(0, 10))

        # ---- Battery ----
        self.battery_label = ctk.CTkLabel(self)
        self.update_battery_info()
        self.battery_label.pack(side="left", padx=(0, 10))

        # ---- Spacer ----
        spacer = ctk.CTkLabel(self, text="")
        spacer.pack(side="left", expand=True)

        model = subprocess.check_output(
            ["adb", "shell", "getprop", "ro.product.model"], text=True
        ).strip()

        # ---- Device Info ----
        self.device_label = ctk.CTkLabel(
            self, text=f"📱 {model} [{'WLAN' if is_wlan_connected() else 'USB'}]"
        )
        self.device_label.pack(side="left", padx=(0, 10))

        if is_wlan_connected():
            ip = get_wlan_ip()
            if ip:
                self.ip_label = ctk.CTkLabel(self, text=f"🌐 {ip}")
                self.ip_label.pack(side="left")

    def update_storage_info(self):
        def run():
            try:
                output = subprocess.check_output(
                    ["adb", "shell", "df", "-h", "/data"], text=True
                )
                lines = output.strip().splitlines()
                if len(lines) < 2:
                    return "0", "0"
                parts = lines[1].split()
                if len(parts) < 4:
                    return "0", "0"
                return parts[1], parts[3]
            except subprocess.CalledProcessError:
                return "0", "0"

        # Update storage
        total, available = run()
        self.storage_label.configure(text=f"💾 {available} / {total}")

    def update_battery_info(self):
        """
        Returns battery level and charging status ('charging' or 'discharging').
        """

        def run():
            try:
                output = subprocess.check_output(
                    ["adb", "shell", "dumpsys", "battery"], text=True
                )
                level = None
                charging = False
                for line in output.splitlines():
                    line = line.strip()
                    if line.startswith("level:"):
                        level = line.split(":")[1].strip()
                    elif line.startswith("status:"):
                        status = line.split(":")[1].strip()
                        # Battery status codes from Android:
                        # 1 = Unknown, 2 = Charging, 3 = Discharging, 4 = Not charging, 5 = Full
                        if status == "2":  # Charging or Full
                            charging = True
                return level or "0", charging
            except subprocess.CalledProcessError:
                return "0", False

        level, charging = run()
        battery_icon = "🔌" if charging else "🔋"
        self.battery_label.configure(text=f"{battery_icon} {level}%")

    def poll_device_info(self, interval: float = 5.0):
        def run():
            try:
                # Update storage
                self.update_storage_info()
                # Update battery
                self.update_battery_info()
            except subprocess.CalledProcessError as e:
                print(f"Error running adb: {e}")
            finally:
                threading.Timer(interval, run).start()

        run()
