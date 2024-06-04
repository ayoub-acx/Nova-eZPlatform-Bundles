<?php

namespace Novactive\Bundle\eZProtectedContentBundle\Repository;

use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Ibexa\Contracts\Core\Repository\Repository;
use Novactive\Bundle\eZProtectedContentBundle\Entity\ProtectedTokenStorage;

class ProtectedTokenStorageRepository
{
    public function __construct(
        protected readonly EntityManagerInterface $entityManager,
    ) { }

    protected function getAlias(): string
    {
        return 'pts';
    }

    protected function getEntityClass(): string
    {
        return ProtectedTokenStorage::class;
    }

    /**
     * @param array $criteria
     * @return ProtectedTokenStorage[]
     */
    public function findUnexpiredBy(array $criteria = []): array
    {
        $entityRepository = $this->entityManager->getRepository($this->getEntityClass());
        $qb = $entityRepository->createQueryBuilder($this->getAlias());

        $qb ->select('c')
            ->from(ProtectedTokenStorage::class, 'c')
            ->where('c.created >= :nowMinusOneHour')
            ->setParameter('nowMinusOneHour', new DateTime('now - 1 hours'));

        foreach ($criteria as $key => $criterion) {
            $qb->andWhere("c.$key = '$criterion'");
        }

        return $qb->getQuery()->getResult();
    }

    public function findExpired(): array
    {
        $entityRepository = $this->entityManager->getRepository($this->getEntityClass());
        $qb = $entityRepository->createQueryBuilder($this->getAlias());
        $qb ->select('c')
            ->from(ProtectedTokenStorage::class, 'c')
            ->where('c.created < :nowMinusOneHour')
            ->setParameter('nowMinusOneHour', new DateTime('now - 1 hours'));

        return $qb->getQuery()->getResult();
    }

    /**
     * @param ProtectedTokenStorage $entity
     * @return void
     * @see EntityManagerInterface::remove()
     */
    public function remove(ProtectedTokenStorage $entity): void
    {
        $this->entityManager->remove($entity);
    }

    /**
     * @return void
     * @see EntityManagerInterface::flush()
     */
    public function flush(): void
    {
        $this->entityManager->flush();
    }
}
