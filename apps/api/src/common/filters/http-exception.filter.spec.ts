import { BadRequestException, type ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('uses the generated response request ID when serializing an error', () => {
    const json = jest.fn();
    const response = {
      getHeader: jest.fn().mockReturnValue('generated-request-id'),
      status: jest.fn().mockReturnValue({ json }),
    };
    const host = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          method: 'GET',
          originalUrl: '/api/example',
        }),
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;

    new HttpExceptionFilter().catch(
      new BadRequestException('Invalid input'),
      host,
    );

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'generated-request-id',
      }),
    );
  });
});
