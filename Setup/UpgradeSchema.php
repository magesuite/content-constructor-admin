<?php

namespace MageSuite\ContentConstructorAdmin\Setup;

class UpgradeSchema implements \Magento\Framework\Setup\UpgradeSchemaInterface
{
    const DB_CMS_PAGE_TABLE = "cms_page";
    const DB_ATTRIBUTE_NAME = "content_constructor_content";

    protected $eavSetupFactory;

    protected $migration;

    public function __construct(
        \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory,
        \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup,
        \MageSuite\ContentConstructorAdmin\Service\Upgrade\Migration $migration
    ) {
        $this->eavSetupFactory = $eavSetupFactory->create(['setup' => $moduleDataSetup]);
        $this->migration = $migration;
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
                'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                'default' => '[]',
                'visible' => 0,
            ]);

            $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Category::ENTITY, self::DB_ATTRIBUTE_NAME, [
                'type' => 'text',
                'label' => 'Content Constructor Content',
                'input' => 'text',
                'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                'default' => '[]',
                'visible' => 0,
            ]);

            $this->migration->transferOldXmlValuesToNewJsonFields();
        }
        $setup->endSetup();
    }
}
