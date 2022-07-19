import { expect } from 'chai';

import * as Support from '../../test/support';
import { queryInterfaceDecorator } from '../index';
import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
import { buildExistTriggerStatement } from './helpers/buildExistTriggerStatement';
import { unwrapSelectOneValue } from './helpers/unwrapSelectOneValue';
import { getTriggerActionStatement } from './helpers/testing/getTriggerActionStatement';

describe(Support.getTestDialectTeaser('renameColumn'), () => {
  let queryInterface: QueryInterface;
  beforeEach(async function () {
    queryInterface = queryInterfaceDecorator(this.sequelize.getQueryInterface());
    await queryInterface.createTable('a', {
      a_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('b', {
      b_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      a_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'a',
          key: 'a_id',
        },
        allowNull: false,
        onDelete: 'PARANOID CASCADE',
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });
  });

  afterEach(async function () {
    await queryInterface.dropAllTables();
  });

  it('supports renaming a dependent table column', async function () {
    await queryInterface.renameColumn('b', 'a_id', 'z_id');
    const triggerStillExists = !!unwrapSelectOneValue(
      await queryInterface.sequelize.query(buildExistTriggerStatement('a', 'b'), {
        type: QueryTypes.SELECT,
      }),
    );
    const actionStatement = unwrapSelectOneValue(
      await queryInterface.sequelize.query(getTriggerActionStatement('a', 'b'), {
        type: QueryTypes.SELECT,
      }),
    );
    expect(triggerStillExists).to.be.true;
    expect(actionStatement).to.contain(`WHERE \`b\`.\`z_id\` = \`NEW\`.\`a_id\`;`);
  });

  it.skip('supports renaming an independent table column', async function () {
    // functionality is implemented but cannot be tested because it is not possible
    // to set ALGORITHM=INPLACE when renaming a column
    // see https://github.com/sequelize/sequelize/issues/10653
    // without that, the following error appears:
    // 'ALGORITHM=COPY is not supported. Reason: Columns participating in a foreign key are renamed. Try ALGORITHM=INPLACE.'

    await queryInterface.renameColumn('a', 'a_id', 'z_id');
    const triggerStillExists = !!unwrapSelectOneValue(
      await queryInterface.sequelize.query(buildExistTriggerStatement('a', 'b'), {
        type: QueryTypes.SELECT,
      }),
    );
    const actionStatement = unwrapSelectOneValue(
      await queryInterface.sequelize.query(getTriggerActionStatement('a', 'b'), {
        type: QueryTypes.SELECT,
      }),
    );
    expect(triggerStillExists).to.be.true;
    expect(actionStatement).to.contain(`WHERE \`b\`.\`a_id\` = \`NEW\`.\`z_id\`;`);
  });
});
