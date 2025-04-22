// import { ExecutionContext, Injectable } from "@nestjs/common";
// import type { FastifyRequest } from "fastify";
// import { I18nResolver, I18nResolverOptions } from "nestjs-i18n";

// @Injectable()
// export class CustomI18nResolver implements I18nResolver {
//   // TODO: schema bolgood common ruu hiih
//   // FIXME: Locales 'ne', 'id' missing
//   private translationLocales = ["en", "ja", "ko", "pt", "vi", "zh-CN", "zh-TW"];

//   constructor(@I18nResolverOptions() private keys: string[] = []) {}

//   resolve(context: ExecutionContext) {
//     const ctx = context.switchToHttp();
//     const request = ctx.getRequest<FastifyRequest>();
//     let lang: string | undefined;

//     if (request) {
//       for (const key of this.keys) {
//         if (key === "accept-language") {
//           return;
//         }

//         if (
//           request.headers !== undefined &&
//           request.headers[key] !== undefined &&
//           typeof request.headers[key] === "string"
//         ) {
//           const _lang = request.headers[key];
//           lang = this.localeMapper(_lang);
//           break;
//         }
//       }
//     }

//     if (!lang || !this.translationLocales.includes(lang)) {
//       return;
//     }

//     return lang;
//   }

//   private localeMapper = (lang: string) => {
//     switch (lang) {
//       case "cn":
//         return "zh-CN";
//       case "tw":
//         return "zh-TW";
//     }
//     return lang;
//   };
// }
