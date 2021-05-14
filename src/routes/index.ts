import { IRouter, Router } from "express";
import fs from "fs";
import path from "path";

const api = Router();

const modules = fs.readdirSync(__dirname);

modules.forEach(async (file) => {
  const url = `/${file.split(".")[0]}`;

  // Terminate early with index file
  if (url === "/index") return;

  const modulePath = path.join(__dirname, file);
  const module = await import(modulePath);
  const router: IRouter = module.default;

  api.use(url, router);
});

export default api;
