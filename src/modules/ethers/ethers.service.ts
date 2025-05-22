import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, parseEther, formatEther } from 'ethers';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private account1: ethers.Wallet;
  private account2: ethers.Wallet;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey1 = this.configService.get<string>('ACCOUNT1_PRIVATE_KEY');
    const privateKey2 = this.configService.get<string>('ACCOUNT2_PRIVATE_KEY');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.account1 = new ethers.Wallet(privateKey1!, this.provider);
    this.account2 = new ethers.Wallet(privateKey2!, this.provider);
  }

  getAccount1() {
    return this.account1;
  }

  getAccount2() {
    return this.account2;
  }

  getNonce(account: ethers.Wallet) {
    return account.getNonce();
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  /**
   * account1의 잔액을 조회하여 반환합니다 (ETH 단위 문자열).
   */
  async getBalance() {
    return await this.provider.getBalance(this.account1.address);//contract token이 아니라 계정의 코인
  }

  /**
   * account1이 account2에게 1 ETH를 전송합니다.
   * @param nonce 트랜잭션 Nonce (보통 미리 조회해서 넣음)
   */
  async send1ETH(nonce: number) {
    // const tx = await this.account1.sendTransaction({
    //   to: this.account2.address,
    //   value: parseEther('1'),
    //   nonce,
    //   gasLimit: 21000,
    // });
    // return tx.wait(); 
    await this.account1.sendTransaction({
      to:this.account2.address,
      value:this.parseEther('1'),
      nonce:nonce
    });
  }

  /**
   * account2가 account1에게 30 ETH를 전송합니다.
   */
  async send30ETH() {
    // const tx = await this.account2.sendTransaction({
    //   to: this.account1.address,
    //   value: parseEther('30'),
    //   gasLimit: 21000,
    // });
    // return tx.wait();
    await this.account2.sendTransaction({
      to:this.account1.address,
      value:this.parseEther('30'),
    });
  }
}
