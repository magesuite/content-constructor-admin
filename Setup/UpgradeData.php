<?php

namespace MageSuite\ContentConstructorAdmin\Setup;

class UpgradeData implements \Magento\Framework\Setup\UpgradeDataInterface
{
    const CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME = "content_constructor_content";
    const LAYOUT_UPDATE_XML_BACKUP_ATTRIBUTE_NAME = "layout_update_xml_backup";

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

                $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Product::ENTITY, self::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME, [
                    'type' => 'text',
                    'label' => 'Content Constructor Content',
                    'input' => 'text',
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'visible' => 0,
                    'required' => 0
                ]);

                $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Product::ENTITY, self::LAYOUT_UPDATE_XML_BACKUP_ATTRIBUTE_NAME, [
                    'type' => 'text',
                    'label' => 'Layout Update XML Backup',
                    'input' => 'text',
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'visible' => 0,
                    'required' => 0
                ]);

                $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Category::ENTITY, self::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME, [
                    'type' => 'text',
                    'label' => 'Content Constructor Content',
                    'input' => 'text',
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'visible' => 0,
                    'required' => 0
                ]);

                $this->eavSetupFactory->addAttribute(\Magento\Catalog\Model\Category::ENTITY, self::LAYOUT_UPDATE_XML_BACKUP_ATTRIBUTE_NAME, [
                    'type' => 'text',
                    'label' => 'Layout Update XML Backup',
                    'input' => 'text',
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'visible' => 0,
                    'required' => 0
                ]);

                $this->migration->transferOldXmlValuesToNewJsonFields();
            });
        }
    }
}
