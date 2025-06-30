import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7110/projectHub')
  .withAutomaticReconnect()
  .build();

export default connection;
