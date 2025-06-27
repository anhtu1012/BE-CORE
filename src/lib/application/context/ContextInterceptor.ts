// import { Request } from 'express';
// import { nanoid } from 'nanoid';
// import { Observable, tap } from 'rxjs';
// import { extractHeader } from '@libs/utils/header.util';
// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { RequestContextService } from './AppRequestContext';

// @Injectable()
// export class ContextInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request: Request = context.switchToHttp().getRequest();

//     /**
//      * Setting an ID in the global context for each request.
//      * This ID can be used as correlation id shown in logs
//      */
//     const requestId = request?.body?.requestId ?? nanoid(6);
//     RequestContextService.setRequestId(requestId);

//     /**
//      * Setting an tenant ID in the global context for each request.
//      * This tenant ID will be used to select correct DB client
//      */
//     const tenantId = extractHeader(request, 'x-tenant-id');
//     RequestContextService.setTenantId(tenantId);

//     return next.handle().pipe(
//       tap(() => {
//         // Perform cleaning if needed
//       }),
//     );
//   }
// }
