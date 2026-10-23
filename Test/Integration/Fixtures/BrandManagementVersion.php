<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Fixtures;

class BrandManagementVersion
{
    protected const PACKAGE_NAME = 'creativestyle/magesuite-brand-management';
    protected const VERSION_2 = '2.0.0';

    public function isVersion2OrHigher(): bool
    {
        $version = \Composer\InstalledVersions::getVersion(self::PACKAGE_NAME);

        return !empty($version) && version_compare($version, self::VERSION_2) >= 0;
    }
}
