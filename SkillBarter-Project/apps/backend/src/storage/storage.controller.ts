import { Controller, Get, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('presigned-url')
  @UseGuards(AuthGuard('jwt'))
  async getPresignedUrl(@Request() req, @Query('filename') filename: string, @Query('contentType') contentType: string) {
    if (!filename || !contentType) {
      throw new BadRequestException('filename and contentType are required');
    }
    
    // RED FLAG PREVENTED: No @UploadedFile() parsing here! 
    // We strictly generate a presigned URL and the browser uploads directly.
    const urlPayload = await this.storageService.generatePresignedUrl(req.user.id, filename, contentType);
    
    return urlPayload;
  }
}
