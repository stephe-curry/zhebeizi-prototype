const test = require('node:test');
const assert = require('node:assert/strict');
require('./model.js');

for (const first of ['find', 'tell']) {
  test('six-year decision and eight-year options after ' + first, () => {
    for (const last of ['lead', 'teacher', 'friend']) {
      const run = Childhood.start();
      assert.deepEqual(Childhood.options(run), ['find', 'tell']);
      assert(!Childhood.choose(run, 'note'));
      assert(!Childhood.next(run));
      assert(Childhood.choose(run, first));
      assert(!Childhood.choose(run, first));
      assert.deepEqual(Childhood.options(run), []);
      assert(Childhood.next(run));
      assert(!Childhood.next(run));

      const helped = first === 'find';
      const feedback = Childhood.actions[first][2];
      if (helped) assert.match(feedback, /你从长凳底下找出红水壶，递给阿宁/);
      else assert.match(feedback, /老师走过去说：“我来找/);
      assert.equal(Childhood.recognition(run)?.id, helped ? run.facts[0].id : undefined);
      assert.deepEqual(Childhood.options(run), helped ? ['lead', 'friend', 'teacher'] : ['lead', 'teacher']);
      const legal = last !== 'friend' || helped;
      assert.equal(Childhood.choose(run, last), legal);
      if (legal) {
        assert.equal(run.facts[1].source, run.facts[0].id);
        assert(!Childhood.choose(run, last));
      }
    }
  });
}
