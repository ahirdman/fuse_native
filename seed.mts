import { copycat } from '@snaplet/copycat';
import { createSeedClient } from '@snaplet/seed';

const seed = await createSeedClient({
  dryRun: false,
  models: {
    public_users: {
      data: {
        subscription: (ctx) => copycat.uuid(ctx.seed),
      },
    },
    subscriptions: {
      data: {
        user_id: (ctx) => ctx.store.public_users[0].id,
      },
    },
  },
});

await seed.$resetDatabase();

const numberOfUsers = 2;

await seed.auth_users((x) => x(numberOfUsers));

await seed.public_users((x) => x(numberOfUsers), {
  connect: true,
});

await seed.subscriptions((x) => x(1), { connect: true });

await seed.tags((x) => x(10), { connect: true });
