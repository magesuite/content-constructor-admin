<?php

namespace MageSuite\ContentConstructorAdmin\Setup;

class UpgradeData implements \Magento\Framework\Setup\UpgradeDataInterface
{
    const DB_CMS_PAGE_TABLE = "cms_page";
    const DB_ATTRIBUTE_NAME = "content_constructor_content";

    /**
     * @var \Magento\Eav\Setup\EavSetupFactory
     */
    protected $eavSetupFactory;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\Upgrade\MigrationFactory
     */
    protected $migration;

    /**
     * @var \Magento\Framework\App\State
     */
    protected $state;

    public function __construct(
        \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory,
        \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup,
        \Magento\Framework\App\State $state,
        \MageSuite\ContentConstructorAdmin\Service\Upgrade\Migration $migration
    )
    {
        $this->eavSetupFactory = $eavSetupFactory->create(['setup' => $moduleDataSetup]);
        $this->migration = $migration;
        $this->state = $state;
    }

    public function upgrade(\Magento\Framework\Setup\ModuleDataSetupInterface $setup, \Magento\Framework\Setup\ModuleContextInterface $context)
    {
        if (version_compare($context->getVersion(), "1.0.1", "<")) {
            $this->state->emulateAreaCode(\Magento\Framework\App\Area::AREA_ADMINHTML, function () use ($setup) {
                $connection = $setup->getConnection();

                $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Product::ENTITY, self::DB_ATTRIBUTE_NAME, [
                    'type' => 'text',
                    'label' => 'Content Constructor Content',
                    'input' => 'text',
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'visible' => 0,
                ]);

                $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Category::ENTITY, self::DB_ATTRIBUTE_NAME, [
                    'type' => 'text',
                    'label' => 'Content Constructor Content',
                    'input' => 'text',
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'visible' => 0,
                ]);

                $this->migration->transferOldXmlValuesToNewJsonFields();
            });
        }
    }
}
