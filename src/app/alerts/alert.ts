export class Alert {

  private readonly typeEnum: AlertType;
  private readonly ALERT_CLASS: string[] = ['danger', 'info', 'success', 'warning'];
  message: string;
  timerId = 0;

  constructor(type: AlertType, message: string) {
    this.typeEnum = type;
    this.message = message;
  }

  get type(): string {
    return this.ALERT_CLASS[this.typeEnum];
  }
}

export enum AlertType { danger, info, success, warning }
