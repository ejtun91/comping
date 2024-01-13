import { ClassProvider, inject, Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";

function describeDestroyService() {
  // Injectable service that extends Subject<void> and implements OnDestroy
  @Injectable()
  class DestroyService extends Subject<void> implements OnDestroy {
    // OnDestroy lifecycle hook implementation
    ngOnDestroy(): void {
      // Notify subscribers of service destruction
      this.next();
      this.complete();
    }
  }

  // Function to provide the DestroyService as a class provider
  function provideDestroyService(): ClassProvider {
    return {
      provide: DestroyService,
      useClass: DestroyService,
    };
  }

  // Function to inject the DestroyService as an Observable
  function injectDestroyService(): Observable<void> {
    // Use Angular's inject function to get the DestroyService instance
    const destroy$ = inject(DestroyService, { self: true, optional: true });

    // Throw an error if the service instance is not available
    if (!destroy$) {
      throw new Error("DestroyService not found");
    }

    // Return the DestroyService instance as an observable
    return destroy$.asObservable();
  }

  // Return the functions to provide and inject the DestroyService
  return {
    provideDestroyService,
    injectDestroyService,
  };
}

export const { provideDestroyService, injectDestroyService } =
  describeDestroyService();
