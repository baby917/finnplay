import express, { NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, RequestHandler } from "express";
import gamesData from "./data";

declare module "express-session" {
  interface SessionData {
    user?: {
      username: string;
    };
  }
}

const app = express();
const port = 3001;

// 创建认证检查中间件
const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ success: false, error: "未登录" });
    return;
  }
  next();
};

// 配置中间件
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 配置会话中间件
const MemoryStoreInstance = MemoryStore(session);
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreInstance({
      checkPeriod: 86400000,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 30,
      sameSite: "lax",
    },
  })
);

// 登录接口
app.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (
    (username === "player1" && password === "player1") ||
    (username === "player2" && password === "player2")
  ) {
    req.session.user = {
      username,
    };
    res.json({ ret_code: 0, success: true, user: req.session.user });
  } else {
    res.json({
      ret_code: -1,
      success: false,
      error: "The username or password is incorrect",
    });
  }
});

// 登出接口
app.get("/api/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, error: "登出失败" });
    } else {
      res.clearCookie("connect.sid");
      res.json({ success: true, ret_code: 0 });
    }
  });
});

// 游戏列表
app.get("/api/gameList", requireAuth, (req: Request, res: Response) => {
  res.json({
    ret_code: 0,
    success: true,
    data: {
      gameList: gamesData.games,
    },
  });
});

// 筛选条件
app.get("/api/filters", requireAuth, ((req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "未登录" });
  }

  res.json({
    ret_code: 0,
    success: true,
    data: {
      providers: gamesData.providers,
      groups: gamesData.groups,
    },
  });
}) as RequestHandler);

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
