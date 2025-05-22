import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../ethers/ethers.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly ethersService: EthersService) {}

  async getBalance() {
    try {
      const balance = await this.ethersService.getBalance();
      const formatted = this.ethersService.formatEther(balance);
      this.logger.log(`[getBalance] ${formatted}`);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async tenTimesOneEthTransfer() {
    const start = Date.now();
    const tenTime = 10;
    let result = false;

    try {
      for (let i = 0; i < tenTime; i++) {
        const nonce = await this.ethersService.getNonce(this.ethersService.getAccount1());
        await this.ethersService.send1ETH(nonce);
      }
      result = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(message);
    } finally {
      if (result) {
        const end = Date.now();
        this.logger.log(`[tenTimesOneEthTransfer] 실행 시간: ${end - start}ms`);
      }
    }
  }

  async thirtyEthTransfer() {
    try {
      await this.ethersService.send30ETH();
      this.logger.log('[thirtyEthTransfer] 30 ETH 전송 성공');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(message);
    }
  }
}
