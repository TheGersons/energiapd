import { ModuleModel } from "@model/module.model";
import { PageModel } from "@model/page.model";

// Un módulo tiene muchas páginas
ModuleModel.hasMany(PageModel, { foreignKey: "idModule", as: "page" });

// Una página pertenece a un módulo
PageModel.belongsTo(ModuleModel, { foreignKey: "idModule", as: "module" });
