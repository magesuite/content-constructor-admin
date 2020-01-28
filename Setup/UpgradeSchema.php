<?php

namespace MageSuite\ContentConstructorAdmin\Setup;

class UpgradeSchema implements \Magento\Framework\Setup\UpgradeSchemaInterface
{
    const DB_CMS_PAGE_TABLE = "cms_page";
    const DB_ATTRIBUTE_NAME = "content_constructor_content";

    protected $eavSetupFactory;

    public function __construct(
        \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory,
        \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup
    ) {
        $this->eavSetupFactory = $eavSetupFactory->create(['setup' => $moduleDataSetup]);
    }

    public function upgrade(\Magento\Framework\Setup\SchemaSetupInterface $setup, \Magento\Framework\Setup\ModuleContextInterface $context)
    {
        $setup->startSetup();
        if (version_compare($context->getVersion(), "1.0.1", "<")) {
            $connection = $setup->getConnection();
            $connection->addColumn(self::DB_CMS_PAGE_TABLE, self::DB_ATTRIBUTE_NAME, [
                "type" => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                "comment" => "Layout Update JSON"
            ]);

            $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Product::ENTITY, self::DB_ATTRIBUTE_NAME, [
                'type' => 'text',
                'label' => 'Content Constructor Content',
                'input' => 'text',
                'visible' => 0,
            ]);

            $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Category::ENTITY, self::DB_ATTRIBUTE_NAME, [
                'type' => 'text',
                'label' => 'Content Constructor Content',
                'input' => 'text',
                'visible' => 0,
            ]);
        }
        $setup->endSetup();
    }
}
