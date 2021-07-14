export class Alert {

  timerId = 0;
  message = '';
  timeout: number;
  private readonly typeEnum: AlertType;
  private readonly alertClasses: string[] = ['danger', 'info', 'success', 'warning'];

  constructor(type: AlertType, message: string, timeout: number = 7000) {
    this.typeEnum = type;
    this.message = message;
    this.timeout = timeout;
  }

  get type(): string {
    return this.alertClasses[this.typeEnum];
  }
}

export enum AlertType { danger, info, success, warning }
