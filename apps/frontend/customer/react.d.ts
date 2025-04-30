import type { NextRequest, NextResponse } from "next/server";
import type { FC, PropsWithChildren, ReactNode } from "react";

import type { FormState } from "@/schemas/valibot/form_state_schema";

declare module "react" {
  export declare type FCC<P = {}> = FC<PropsWithChildren<P>>;
  export declare type Page<P = {}, SP = {}> = FC<RouterParams<P, SP>>;
  export declare type RouteHandler<P = {}> = (
    request: NextRequest,
    context: RouteHandlerContext<P>
  ) => Promise<Response | NextResponse>;
  export declare type Layout<P = {}> = FCC<RouterParams<P>>;
  export declare type ServerActionWithoutState<Payload = FormData> = (
    payload: Awaited<Payload>
  ) => Payload | Promise<Payload>;
  export declare type ServerAction<
    State = FormState | undefined,
    Payload = FormData,
  > = (state: Awaited<State>, payload: Payload) => State | Promise<State>;
}

declare type RouteHandlerContext<P> = {
  params: P;
};
declare type RouterParams<P, SP> = {
  params: P;
  searchParams: SP;
};
