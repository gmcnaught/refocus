/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/db/model/event/update.js
 */
'use strict';
const expect = require('chai').expect;
const tu = require('../../../testUtils');
const u = require('./utils');
const r = require('../room/utils');
const rt = require('../roomType/utils');
const b = require('../bot/utils');
const bd = require('../botData/utils');
const Event = tu.db.Event;
const Room = tu.db.Room;
const RoomType = tu.db.RoomType;
const Bot = tu.db.Bot;
const BotData = tu.db.BotData;
const ZERO = 0;

describe('tests/db/model/event/update.js >', () => {
  beforeEach((done) => {
    const testBotData = bd.getStandard();
    const testEvent = u.getStandard();
    RoomType.create(rt.getStandard())
    .then((roomType) => {
      const room = r.getStandard();
      room.type = roomType.id;
      return Room.create(room);
    })
    .then((room) => {
      testBotData.roomId = room.id;
      testEvent.roomId = room.id;
      return Bot.create(b.getStandard());
    })
    .then((bot) => {
      testBotData.botId = bot.id;
      testEvent.botId = bot.id;
      return BotData.create(testBotData);
    })
    .then((botData) => {
      testEvent.botDataId = botData.id;
      return Event.create(testEvent);
    })
    .then(() => done())
    .catch(done);
  });

  afterEach(u.forceDelete);

  it('ok, event log', (done) => {
    Room.findAll()
    .then((rooms) => Event.findOne({ where: { roomId: rooms[ZERO].id } }))
    .then((events) => events.update({ log: 'New Log' }))
    .then((o) => {
      expect(o).to.have.property('log').to.equal('New Log');
      done();
    })
    .catch(done);
  });
});
