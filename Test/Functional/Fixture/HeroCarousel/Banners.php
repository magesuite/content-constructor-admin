<?php

namespace MageSuite\ContentConstructorAdmin\Test\Fixture\HeroCarousel;

use MageSuite\ContentConstructorAdmin\Test\Assets\MediaDeployer;
use Magento\Mtf\Fixture\DataSource;
use Magento\Mtf\Fixture\FixtureFactory;
use Magento\Mtf\Repository\RepositoryFactory;

class Banners extends DataSource
{
    /**
     * @param RepositoryFactory $repositoryFactory
     * @param FixtureFactory $fixtureFactory
     * @param MediaDeployer $mediaDeployer
     * @param array $params
     * @param array $data
     */
    public function __construct(
        RepositoryFactory $repositoryFactory,
        FixtureFactory $fixtureFactory,
        MediaDeployer $mediaDeployer,
        array $params,
        array $data = []
    ) {
        $this->params = $params;

        if (!empty($data)) {
            foreach ($data as &$banner) {
                $targetLink = $banner['cta_target_link'];
                $banner['cta_target_link'] = $fixtureFactory->createByCode($targetLink['type'], ['dataset' => $targetLink['dataset']]);
                $banner['cta_target_link']->persist();
                $mediaDeployer->deploy($banner['image']);
            }
            $this->data = $data;
        }
    }
}
