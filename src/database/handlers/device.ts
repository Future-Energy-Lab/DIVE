import { Device } from "../../types/device";
import { DeviceModel } from "../models/device";

export async function create(device: Device): Promise<void> {
  await DeviceModel.create(device);
}

export async function findOneByDidUrl(didUrl: string): Promise<Device | null> {
  return DeviceModel.findOne({ didUrl });
}

export async function findAll(): Promise<Device[]> {
  return DeviceModel.find();
}
