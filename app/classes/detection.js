class Detection {
  constructor() {
    this.isPhoneChecked = false; // add this line
    this.isTabletChecked = false; // add this line
    this.isDesktopChecked = false; // add this line
  }
  isPhone() {
    if (!this.isPhoneChecked) { // change this line
      this.isPhoneChecked = true;
      this.isPhoneCheck = document.documentElement.classList.contains("phone");
    }
    return this.isPhoneCheck;
  }
  isTablet() {
    if (!this.isTabletChecked) { // change this line
      this.isTabletChecked = true;
      this.isTabletCheck = document.documentElement.classList.contains("tablet");
    }
    return this.isTabletCheck;
  }
  isDesktop() {
    if (!this.isDesktopChecked) { // change this line
      this.isDesktopChecked = true;
      this.isDesktopCheck = document.documentElement.classList.contains("desktop");
    }
    return this.isDesktopCheck;
  }
}
const DetectionManager = new Detection();
export default DetectionManager;
