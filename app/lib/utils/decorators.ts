/**
 * Decorator that logs function execution time and status
 */
export function LogExecutionTime() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const functionName = `${className}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      const start = performance.now();

      try {
        // Call the original method
        const result = originalMethod.apply(this, args);

        // Handle promise returns (async functions)
        if (result instanceof Promise) {
          return result.then((value) => {
            const executionTime = performance.now() - start;
            console.log(`Function ${functionName} took ${executionTime.toFixed(2)}ms to execute`);
            return value;
          }).catch((error) => {
            const executionTime = performance.now() - start;
            console.log(`Function ${functionName} ended execution (with error)`);
            console.log(`Function ${functionName} took ${executionTime.toFixed(2)}ms to execute`);
            throw error;
          });
        }

        // Handle synchronous functions
        const executionTime = performance.now() - start;
        console.log(`Function ${functionName} took ${executionTime.toFixed(2)}ms to execute`);
        return result;
      } catch (error) {
        const executionTime = performance.now() - start;
        console.log(`Function ${functionName} took ${executionTime.toFixed(2)}ms to execute`);
        throw error;
      }
    };

    return descriptor;
  };
}
