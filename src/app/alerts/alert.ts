export class Alert {

  message = '';
  timerId = 0;
  private readonly typeEnum: AlertType;
  private readonly alertClasses: string[] = ['danger', 'info', 'success', 'warning'];

  constructor(type: AlertType, message: string) {
    this.typeEnum = type;
    this.message = message;
  }

  get type(): string {
    return this.alertClasses[this.typeEnum];
  }
}

export enum AlertType { danger, info, success, warning }
