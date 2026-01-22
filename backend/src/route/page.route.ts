import { pageController } from "@controller/page.controller";
import { Router } from "express"

class PageRoute {
    router: Router

    constructor() {
        this.router = Router();
        this.routes();
    }
    
    private routes() {
        this.router.get("/findAll", pageController.findAll);
        this.router.get("/findOne", pageController.findOne);
        this.router.post("/create", pageController.create);
        this.router.put("/update", pageController.update);
        this.router.delete("/delete", pageController.delete)
    }

}

export default new PageRoute().router