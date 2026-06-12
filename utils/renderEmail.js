import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renderEmailTemplate = async (template, data) => {
  const templatePath = path.join(
    __dirname,
    "../views/emails",
    `${template}.ejs`,
  );

  return await ejs.renderFile(templatePath, data);
};

export { renderEmailTemplate };
