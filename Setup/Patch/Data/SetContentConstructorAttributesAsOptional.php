<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Setup\Patch\Data;

class SetContentConstructorAttributesAsOptional implements \Magento\Framework\Setup\Patch\DataPatchInterface
{
    protected \Magento\Eav\Setup\EavSetup $eavSetup;

    protected array $contentConstructorAttributesEntityTypes = [
        \Magento\Catalog\Model\Category::ENTITY,
        \Magento\Catalog\Model\Product::ENTITY,
    ];

    protected array $contentConstructorAttributes = [
        \MageSuite\ContentConstructorAdmin\Setup\Patch\Data\AddContentConstructorContentAttribute::ATTRIBUTE_CODE,
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
        return [
            \MageSuite\ContentConstructorAdmin\Setup\Patch\Data\AddContentConstructorContentAttribute::class,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }
}
