<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Setup\Patch\Data;

class RemoveLayoutUpdateXmlBackupAttribute implements \Magento\Framework\Setup\Patch\DataPatchInterface
{
    protected const ATTRIBUTE_CODE = 'layout_update_xml_backup';

    public function __construct(
        protected \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup,
        protected \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory
    ) {
    }

    public function apply(): self
    {
        $eavSetup = $this->eavSetupFactory->create(['setup' => $this->moduleDataSetup]);

        $eavSetup->removeAttribute(\Magento\Catalog\Model\Product::ENTITY, self::ATTRIBUTE_CODE);
        $eavSetup->removeAttribute(\Magento\Catalog\Model\Category::ENTITY, self::ATTRIBUTE_CODE);

        return $this;
    }

    public static function getDependencies(): array
    {
        return [
            \MageSuite\ContentConstructorAdmin\Setup\Patch\Data\SetContentConstructorAttributesAsOptional::class,
        ];
    }

    public function getAliases(): array
    {
        return [];
    }
}
