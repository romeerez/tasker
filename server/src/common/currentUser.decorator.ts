import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type CurrentUser = {
  id: number;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    return {
      id: user.sub,
    };
  },
);
