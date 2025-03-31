import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestMiddleware.name); // Logger 인스턴스 생성
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  use(req: Request, res: Response, next: Function) {
    this.logger.log(
      JSON.stringify({
        url: req.url,
        query: req.query,
        body: req.body,
      }),
    );
    next();
  }
}