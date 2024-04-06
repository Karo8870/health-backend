import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BuyPremiumDto } from './dto/buy-premium.dto';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {
	}

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

	@Patch('personal')
	updatePersonal(@Body() updateProfileDto: UpdateProfileDto) {
		return this.profileService.updatePersonal(updateProfileDto);
	}

	@Patch('goals')
	updateGoals(@Body() updateProfileDto: UpdateProfileDto) {
		return this.profileService.updateGoals(updateProfileDto);
	}

	@Post('premium')
	buyPremium(@Body() buyPremiumDto: BuyPremiumDto) {
		return this.profileService.buyPremium(buyPremiumDto);
	}

	@Post('dailyChallenge')
	dailyLog() {
		return this.profileService.dailyChallenge();
	}
}
