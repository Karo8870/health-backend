import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	getProfile() {
		return this.profileService.getProfile();
	}

	@Get('preferences')
	getPreferences() {
		return this.profileService.getPreferences();
	}

	@Patch()
	updatePreferences(@Body() updateProfileDto: UpdateProfileDto) {
		return this.profileService.updatePreferences(updateProfileDto);
	}
}
