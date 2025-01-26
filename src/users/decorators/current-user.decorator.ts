import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    return req.currentUser;
  },
);

// somethings to note, here we are using context because nest can be worked with many other kind of request
// like grpc, websockets etc and in this, it is better to be called a context than request because it can be different
// for different kind of name
