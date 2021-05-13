import mongoose, { ConnectOptions } from "mongoose";
import createDebug from "debug";

export default async function connect() {
  const debug = createDebug("app");
  const options: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(process.env.MONGO_URI as string, options);
  debug("⚡ Database connected");
}
