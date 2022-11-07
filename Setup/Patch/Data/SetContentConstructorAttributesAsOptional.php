<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Setup\Patch\Data;

class SetContentConstructorAttributesAsOptional implements \Magento\Framework\Setup\Patch\DataPatchInterface
{
    /**
     * @var \Magento\Eav\Setup\EavSetup
     */
    protected $eavSetup;

    protected $contentConstructorAttributesEntityTypes = [
        \Magento\Catalog\Model\Category::ENTITY,
        \Magento\Catalog\Model\Product::ENTITY
    ];

    protected $contentConstructorAttributes = [
        \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME,
        \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::LAYOUT_UPDATE_XML_BACKUP_ATTRIBUTE_NAME
    ];

    public function __construct(
        \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory,
        \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup
    )
    {
        $this->eavSetup = $eavSetupFactory->create(['setup' => $moduleDataSetup]);
    }

    /**
     * {@inheritdoc}
     */
    public function apply()
    {
        foreach ($this->contentConstructorAttributesEntityTypes as $contentConstructorAttributesEntityType) {
            foreach ($this->contentConstructorAttributes as $contentConstructorAttribute) {
                if (!$this->eavSetup->getAttribute($contentConstructorAttributesEntityType, $contentConstructorAttribute)) {
                    continue;
                }
                $this->eavSetup->updateAttribute($contentConstructorAttributesEntityType, $contentConstructorAttribute, 'is_required', 'false');
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function getDependencies()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }
}
