const _devchallenge_contract = require("../migrations/2_devchallenge_contract");

const BowheadDevChallenge = artifacts.require("./BowheadDevChallenge.sol");
const truffleAssert = require('truffle-assertions');

require('chai')
  .use(require('chai-as-promised'))
  .should();

const ERROR_MSG = 'VM Exception while processing transaction: revert';

contract('BowheadDevChallenge', async accounts => {
  const admin = accounts[0];
  const user1 = accounts[1];

  const data = 'foo bar';

  let bhDevChallenge;

  before('init', async () => {
    bhDevChallenge = await BowheadDevChallenge.deployed();
  });


  describe('Unregistered users', async () => {
    it('Must not get her health data', async() => {
      await bhDevChallenge.getHealthData.call({ from: user1 })
        .should.be.rejectedWith(ERROR_MSG);
    });

    it('Must not add health data', async() => {
      await bhDevChallenge.addHealthData(web3.utils.asciiToHex(data), { from: user1 })
        .should.be.rejectedWith(ERROR_MSG);
    });

    it('Must be able to register', async () => {
      const tx = await bhDevChallenge.registerUser(2, { from: user1 });
      truffleAssert.eventEmitted(tx, 'UserRegistered', (e) => (e.user == user1 && e.level == 2));
    });
    
  });
  
  describe('Registered users', async () => {
    it('Must be able to add health data', async () => {
      await bhDevChallenge.registerUser(2, { from: user1 });
      const tx = await bhDevChallenge.addHealthData(web3.utils.asciiToHex(data), { from: user1 });

      truffleAssert.eventEmitted(tx, 'NewUserEarnings', (e) => (e.user == user1 && e.earning == 2));
    });
    
    it('Must be able to get her data', async () => {
      await bhDevChallenge.registerUser(2, { from: user1 });
      await bhDevChallenge.addHealthData(web3.utils.asciiToHex(data), { from: user1 });

      const addedData = await bhDevChallenge.getHealthData.call({ from: user1 });
      assert.equal(2, addedData.length, "There aren't 2 health data added")
    });
  });
});